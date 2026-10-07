# Ceph S3 bootstrap

The platform has three private, versioned Ceph RGW buckets:

| Bucket | Purpose |
| --- | --- |
| `geodata-raw` | Immutable raw uploads and imports. |
| `geodata-derived` | GDAL outputs, validation reports and tileset artifacts. |
| `geodata-styles` | Versioned MapLibre styles, sprites and glyph assets. |

Before running the job, create the secret from the template without committing it:

```sh
cp deployment/storage/ceph-s3-credentials.example.yaml deployment/storage/ceph-s3-credentials.yaml
# Set the private Ceph RGW endpoint and a least-privilege access key.
kubectl apply -f deployment/namespace.yaml
kubectl apply -f deployment/storage/ceph-s3-credentials.yaml
kubectl apply -k deployment/storage
```

The bootstrap Job uses the standard AWS CLI against Ceph's S3 endpoint; it does not depend on MinIO or `mc`. Its image must be mirrored as `registry.internal/platform/aws-cli:2.31.22` before deployment. It must not be pulled from a public registry.

The access key must be restricted to these buckets. It must not have cluster-admin privileges and must never be exposed to browsers. The future Geodata API will issue short-lived presigned multipart URLs for uploads.

