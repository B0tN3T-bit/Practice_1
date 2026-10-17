# Kubernetes deployment — frontend

Apply order:

```bash
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml -f deployment.yaml -f service.yaml -f hpa.yaml
kubectl apply -f ingress.yaml
```

(Deploy the backend repo's `kube/` first — see its README — since this frontend proxies `/items` to the `backend` Service.)

## Before applying

- Replace `<dockerhub-username>` in `deployment.yaml`.
- Replace `<your-domain>` in `ingress.yaml` with your real domain.
- `dockerhub-secret` must exist in the `simple-app` namespace if the image is private (see backend repo's README for the `kubectl create secret docker-registry` command — it's the same namespace, so one secret covers both).
- Cluster needs an ingress controller installed (e.g. [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/)) matching `ingressClassName: nginx`. If your cluster uses a different controller/class, update `ingress.yaml` accordingly.

## Build & push the image

```bash
docker build --build-arg VITE_API_URL=/items -t docker.io/YOUR_DOCKERHUB_USERNAME/frontend:latest .
docker push docker.io/YOUR_DOCKERHUB_USERNAME/frontend:latest
```

## Access

Point your domain's DNS **A record** at the ingress controller's external IP:

```bash
kubectl get svc -n ingress-nginx ingress-nginx-controller
```

Quick test without DNS/ingress:

```bash
kubectl port-forward -n simple-app svc/frontend 8080:80
# http://localhost:8080
```

## Notes

- `configmap.yaml` holds `BACKEND_HOST`/`BACKEND_PORT` — nginx fills these into the proxy_pass target at container startup (envsubst). Change values + restart pods, no image rebuild needed.
- `namespace.yaml` is an identical copy of the backend repo's — applying both is idempotent.
