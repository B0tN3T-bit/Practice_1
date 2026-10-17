# Kubernetes deployment — backend

Apply order:

```bash
kubectl apply -f namespace.yaml
kubectl apply -f mysql-secret.yaml -f mysql-service.yaml -f mysql-statefulset.yaml
kubectl wait -n simple-app --for=condition=ready pod -l app=mysql --timeout=120s
kubectl apply -f secret.yaml
kubectl apply -f migration-job.yaml
kubectl wait -n simple-app --for=condition=complete job/backend-migration --timeout=120s
kubectl apply -f deployment.yaml -f service.yaml -f hpa.yaml
```

## Before applying

- Replace `<dockerhub-username>` in `deployment.yaml` and `migration-job.yaml`.
- `dockerhub-secret` must exist in the `simple-app` namespace if the image is private:
  ```bash
  kubectl create secret docker-registry dockerhub-secret \
    -n simple-app \
    --docker-username=YOUR_DOCKERHUB_USERNAME \
    --docker-password=YOUR_DOCKERHUB_TOKEN
  ```
- `mysql-secret.yaml` / `secret.yaml` have demo values (`root`/`root`) — replace before any real deployment.

## Build & push the image

```bash
docker build -t docker.io/YOUR_DOCKERHUB_USERNAME/backend:latest .
docker push docker.io/YOUR_DOCKERHUB_USERNAME/backend:latest
```

## Notes

- `mysql-*.yaml` is a **temporary, self-contained MySQL** — none of the other company repos deploy a database inside `kube/`, they point at an already-managed external MySQL via the Secret. Once this project has one, delete `mysql-secret.yaml`, `mysql-statefulset.yaml`, `mysql-service.yaml` and just update `DB_HOST`/`DB_PORT` in `secret.yaml`.
- MySQL runs as a **StatefulSet**, not a Deployment, because it holds real data: it gets a stable pod name/DNS (`mysql-0`) and its own `PersistentVolumeClaim` via `volumeClaimTemplates`, created and retained per pod. `mysql-service.yaml` is a **headless** Service (`clusterIP: None`) — StatefulSets require one, for the stable per-pod DNS to work.
- Deleting the StatefulSet does **not** delete its PVC (by design, so data survives a redeploy) — remove it explicitly with `kubectl delete pvc -n simple-app mysql-data-mysql-0` if you actually want to wipe the data.
- `migration-job.yaml` runs `npm run migration:run:prod` once per apply — re-running it is safe (TypeORM skips already-applied migrations), but re-apply it explicitly (`kubectl delete job backend-migration --ignore-not-found && kubectl apply -f migration-job.yaml`) whenever a new image adds migrations, since `Job` specs are immutable in place.
- `namespace.yaml` is an identical copy of the frontend repo's — applying both is idempotent.
