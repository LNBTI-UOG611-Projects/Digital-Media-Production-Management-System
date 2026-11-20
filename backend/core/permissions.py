from rest_framework.permissions import BasePermission


class HasRole(BasePermission):
    """Allow only signed-in users whose role is in allowed_roles."""

    allowed_roles: tuple[str, ...] = ()
    message = "You do not have permission to do this."

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.role in self.allowed_roles)


def roles(*allowed: str):
    """Build a permission class for any set of roles, e.g. roles("owner", "manager")."""
    return type("RolePermission", (HasRole,), {"allowed_roles": allowed})


IsOwner = roles("owner")
IsManager = roles("manager")
IsEmployee = roles("employee")
IsFreelancer = roles("freelancer")
IsClient = roles("client")
IsOwnerOrManager = roles("owner", "manager")
IsStaffMember = roles("owner", "manager", "employee")  # everyone on the Lova team (not freelancers or clients)
