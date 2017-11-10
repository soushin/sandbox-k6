FROM loadimpact/k6

COPY ./scripts /data/scripts/

ENTRYPOINT k6 run --vus $VUS --iterations $ITERATIONS --linger "/data/scripts/$SCRIPT"