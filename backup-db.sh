#!/bin/bash
set -euo pipefail
BACKUP_DIR="/home/smknuda2/backups/nihongo"
DATE=$(date +%F)
DEST="$BACKUP_DIR/nihongo-$DATE.db"
mkdir -p "$BACKUP_DIR"

docker exec nihongo-api node -e "import(\"better-sqlite3\").then(async ({default:DB})=>{const db=new DB(\"/data/nihongo.db\",{readonly:true});await db.backup(\"/data/nihongo-backup.tmp.db\");db.close();})"
docker cp nihongo-api:/data/nihongo-backup.tmp.db "$DEST"
docker exec nihongo-api rm -f /data/nihongo-backup.tmp.db

# Salin ke Google Drive (kegagalan upload tidak boleh menggagalkan backup lokal)
if command -v rclone >/dev/null 2>&1; then
  if ! rclone copy "$DEST" gdrive:Nihongo/ --drive-use-trash=false --tpslimit 2 --retries 2; then
    echo "[WARN] $(date '+%F %T') Upload rclone ke gdrive:Nihongo/ gagal; backup lokal tetap tersimpan di $DEST" >&2
  fi
else
  echo "[WARN] $(date '+%F %T') rclone tidak ditemukan; lewati upload offsite" >&2
fi

# Hapus backup lokal > 14 hari, tetapi selalu simpan minimal satu file terbaru
LATEST_BACKUP=$(ls -1t "$BACKUP_DIR"/nihongo-*.db 2>/dev/null | head -n 1 || true)
while IFS= read -r old_file; do
  [ -n "$old_file" ] || continue
  if [ "$old_file" != "$LATEST_BACKUP" ]; then
    rm -f "$old_file"
  fi
done < <(find "$BACKUP_DIR" -maxdepth 1 -name "nihongo-*.db" -mtime +14)
