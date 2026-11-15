#!/bin/bash
set -euo pipefail
BACKUP_DIR="/home/smknuda2/backups/nihongo"
DATE=$(date +%F)
DEST="$BACKUP_DIR/nihongo-$DATE.db"
mkdir -p "$BACKUP_DIR"
docker exec nihongo-api node -e "import(\"better-sqlite3\").then(async ({default:DB})=>{const db=new DB(\"/data/nihongo.db\",{readonly:true});await db.backup(\"/data/nihongo-backup.tmp.db\");db.close();})"
docker cp nihongo-api:/data/nihongo-backup.tmp.db "$DEST"
docker exec nihongo-api rm -f /data/nihongo-backup.tmp.db
find "$BACKUP_DIR" -name "nihongo-*.db" -mtime +14 -delete
