# Broker MQTT local (Docker) — Mosquitto + MQTT Explorer

Sobe um broker **Mosquitto** e o **MQTT Explorer** (web) para o laboratório de WiFi/MQTT.

## Estrutura

```txt
docker-mqtt/
├── docker-compose.yml
└── mosquitto/
    ├── config/
    │   └── mosquitto.conf     # precisa ficar exatamente aqui
    ├── data/                  # persistência
    └── log/                   # logs
```

## Subir

```bash
docker compose up -d
docker compose logs -f mosquitto   # confira "listener" em 1883 e 9001
```

- **Broker MQTT (ESP32):** porta `1883` (TCP).
- **Websockets (navegador):** porta `9001`.
- **MQTT Explorer (ver mensagens):** http://localhost:3000 — autoconecta ao broker.

## Endereço do broker para o ESP32

| Cliente                         | `MQTT_HOST`                                          |
| ------------------------------- | ---------------------------------------------------- |
| ESP32 **físico** (mesma LAN)    | IP da máquina que roda o Docker, ex.: `192.168.0.10` |
| Wokwi + **IoT Gateway** (Club)  | IP da máquina na LAN                                 |
| Aplicativos **no próprio host** | `localhost`                                          |

Descubra o IP da máquina: `ip addr` (Linux), `ifconfig` (macOS) ou `ipconfig` (Windows).

> O `mosquitto.conf` usa `listener 1883 0.0.0.0` (escuta em todas as interfaces) e
> `allow_anonymous true` — necessário no Mosquitto 2.x — então o ESP32 conecta sem usuário/senha.

## Testar pelo terminal (opcional)

```bash
# assinar (dentro do container)
docker exec -it mosquitto mosquitto_sub -t "elt85b/#" -v
# publicar
docker exec -it mosquitto mosquitto_pub -t "elt85b/grupo-a/comando" -m "on"
```

## Derrubar

```bash
docker compose down          # mantém dados/logs
docker compose down -v       # remove também o volume do MQTT Explorer
```
