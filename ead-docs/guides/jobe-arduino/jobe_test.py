#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
jobe_test.py — testa codigo estilo Arduino (PlatformIO) SEM Moodle.

Monta um unico fonte C++ = mock Arduino.h + codigo do aluno (sem o include de
Arduino) + harness, e o executa:
  - no sandbox Jobe (POST /jobe/index.php/restapi/runs), ou
  - localmente com g++ (--local), util para desenvolver sem um Jobe no ar.

Cada caso de teste fornece a entrada (stdin) e a saida esperada (stdout).
A funcao/sketch passa quando outcome == 15 (OK) e o stdout bate.

Uso:
  # local (usa g++; nao precisa de Jobe)
  python jobe_test.py --local --mock arduino-mock/Arduino.h \\
      --student sol.cpp --harness harness/harness_funcao.cpp --tests tests.json

  # via Jobe
  python jobe_test.py --jobe http://localhost:4000 --mock arduino-mock/Arduino.h \\
      --student sol.cpp --harness harness/harness_funcao.cpp --tests tests.json

tests.json:
  [ {"input": "4\\n", "expected": "1\\n"},
    {"input": "7\\n", "expected": "0\\n"} ]
"""
import argparse
import json
import re
import subprocess
import sys
import tempfile
import os
import urllib.request
import urllib.error
from pathlib import Path

OK = 15  # outcome de sucesso do Jobe


def _strip_includes(text, nomes):
    """Remove os #include dos headers mockados (angle ou quote)."""
    alt = "|".join(re.escape(n) for n in nomes)
    pat = re.compile(r'^\s*#\s*include\s*[<"]\s*(' + alt + r')\s*[>"]\s*$', re.M)
    return pat.sub("// (include de mock removido)", text)


def build_source(mock_paths, student_path, harness_path):
    """Monta UM fonte: mocks (na ordem dada) + codigo do aluno + harness.
    Os includes dos proprios mocks (Arduino.h, WiFi.h, PubSubClient.h) sao
    removidos, pois tudo vira um unico arquivo de traducao."""
    nomes = [Path(m).name for m in mock_paths]
    partes = []
    for m in mock_paths:
        partes.append(_strip_includes(Path(m).read_text(encoding="utf-8"), nomes))
    aluno = _strip_includes(Path(student_path).read_text(encoding="utf-8"), nomes)
    harness = Path(harness_path).read_text(encoding="utf-8")
    return ("\n".join(partes) + "\n// ===== codigo do aluno =====\n" + aluno
            + "\n// ===== harness =====\n" + harness + "\n")


# ---------- execução via Jobe ----------
def run_jobe(jobe_url, source, stdin, apikey=None, language="cpp"):
    url = jobe_url.rstrip("/") + "/jobe/index.php/restapi/runs"
    body = json.dumps({"run_spec": {
        "language_id": language,
        "sourcecode": source,
        "input": stdin,
    }}).encode("utf-8")
    headers = {"Content-Type": "application/json"}
    if apikey:
        headers["X-API-KEY"] = apikey
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            r = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return {"outcome": -1, "stdout": "", "cmpinfo": "", "stderr": f"HTTP {e.code}: {e.read().decode('utf-8', 'replace')}"}
    except Exception as e:  # noqa: BLE001
        return {"outcome": -1, "stdout": "", "cmpinfo": "", "stderr": str(e)}
    return {"outcome": r.get("outcome"), "stdout": r.get("stdout", ""),
            "cmpinfo": r.get("cmpinfo", ""), "stderr": r.get("stderr", "")}


# ---------- execução local (g++), para dev sem Jobe ----------
def run_local(source, stdin):
    with tempfile.TemporaryDirectory() as d:
        src = Path(d) / "prog.cpp"
        exe = Path(d) / "prog"
        src.write_text(source, encoding="utf-8")
        comp = subprocess.run(["g++", "-std=c++17", str(src), "-o", str(exe)],
                              capture_output=True, text=True)
        if comp.returncode != 0:
            return {"outcome": 11, "stdout": "", "cmpinfo": comp.stderr, "stderr": ""}
        try:
            run = subprocess.run([str(exe)], input=stdin, capture_output=True,
                                 text=True, timeout=10)
        except subprocess.TimeoutExpired:
            return {"outcome": 13, "stdout": "", "cmpinfo": "", "stderr": "timeout"}
        outcome = OK if run.returncode == 0 else 12
        return {"outcome": outcome, "stdout": run.stdout, "cmpinfo": "", "stderr": run.stderr}


def norm(s):
    # comparacao tolerante a espacos no fim das linhas e newline final
    return "\n".join(line.rstrip() for line in (s or "").rstrip("\n").split("\n"))


def main(argv=None):
    ap = argparse.ArgumentParser(description="Testa codigo Arduino via Jobe (ou g++ local).")
    ap.add_argument("--mock", required=True, action="append",
                    help="header(s) mock; repita para varios (ex.: --mock Arduino.h --mock PubSubClient.h)")
    ap.add_argument("--student", required=True, help="codigo do aluno (.cpp)")
    ap.add_argument("--harness", required=True, help="harness/driver (.cpp)")
    ap.add_argument("--tests", required=True, help="tests.json [{input, expected}]")
    ap.add_argument("--jobe", help="URL do Jobe (ex.: http://localhost:4000)")
    ap.add_argument("--apikey", help="X-API-KEY do Jobe, se exigido")
    ap.add_argument("--local", action="store_true", help="executa com g++ local em vez do Jobe")
    args = ap.parse_args(argv)

    if not args.local and not args.jobe:
        ap.error("informe --jobe URL ou use --local")

    source = build_source(args.mock, args.student, args.harness)
    casos = json.loads(Path(args.tests).read_text(encoding="utf-8"))

    passou = 0
    for i, caso in enumerate(casos, 1):
        entrada = caso.get("input", "")
        esperado = caso.get("expected", "")
        res = run_local(source, entrada) if args.local else run_jobe(args.jobe, source, entrada, args.apikey)

        if res["outcome"] == 11:
            print(f"[{i}] ERRO DE COMPILACAO\n{res['cmpinfo'].strip()}")
            continue
        if res["outcome"] != OK:
            print(f"[{i}] FALHOU (outcome={res['outcome']}) stderr={res['stderr'].strip()}")
            continue
        if norm(res["stdout"]) == norm(esperado):
            passou += 1
            print(f"[{i}] OK")
        else:
            print(f"[{i}] SAIDA DIFERENTE\n  esperado: {esperado!r}\n  obtido:   {res['stdout']!r}")

    total = len(casos)
    print(f"\n{passou}/{total} casos passaram.")
    return 0 if passou == total else 1


if __name__ == "__main__":
    raise SystemExit(main())
