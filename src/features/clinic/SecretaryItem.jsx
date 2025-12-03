import {useState} from "react";
import {Button} from "../../components/ui/button";
import SecretaryPermissionsDialog from "./SecretaryPermissionsDialog";

export default function SecretaryItem({secretary, onUpdatePermissions}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState(() => {
    // Initialize with default permissions if none exist
    const permissions = Array.isArray(secretary.permissions)
      ? secretary.permissions
      : [];

    if (permissions.length > 0) {
      return permissions;
    }
    // Default permissions for new secretaries
    return ["dashboard", "calendar", "patients"];
  });

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prev) => {
      const currentPermissions = Array.isArray(prev) ? prev : [];

      if (currentPermissions.includes(permissionId)) {
        return currentPermissions.filter((p) => p !== permissionId);
      } else {
        return [...currentPermissions, permissionId];
      }
    });
  };

  const handleSavePermissions = () => {
    onUpdatePermissions(secretary.user_id, selectedPermissions);
    setIsOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
        <div>
          <div className="font-medium">{secretary.name}</div>
          <div className="text-sm text-muted-foreground">{secretary.email}</div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
            تعديل الصلاحيات
          </Button>
        </div>
      </div>

      <SecretaryPermissionsDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        secretary={secretary}
        selectedPermissions={selectedPermissions}
        onPermissionChange={handlePermissionChange}
        onSave={handleSavePermissions}
      />
    </>
  );
}
