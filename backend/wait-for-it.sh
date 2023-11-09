#!/bin/bash
# wait-for-it.sh
# Source: https://github.com/vishnubob/wait-for-it

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

until nc -z "$host" "$port"; do
  >&2 echo "[$(date)] - Waiting for $host:$port..."
  sleep 1
done

>&2 echo "[$(date)] - $host:$port is available"
exec $cmd
