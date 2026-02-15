# PhobosAuth

PhobosAuth is a full-stack authentication system providing a secure and scalable solution for managing user authentication and authorization.

## Getting Started

### Prerequisites

- **Helm** (v3+)
- **Kubernetes Cluster** (local like k3d/minikube)

### Usage

1. Clone the repository:

    ```
    git clone https://github.com/PRIM-EDV/phobos-auth.git
    cd phobos-auth
    ```

2. Start the application:
    ```
    helm upgrade --install phobos-auth ./k8s
    ```

## License
This project is licensed under the GNU General Public License v3.0 License. See the [LICENSE](LICENSE) file for details.