import {Card, CardContent, CardHeader} from "../../components/ui/card";
import {SkeletonLine} from "../../components/ui/skeleton";
import SecretaryItem from "./SecretaryItem";
import SecretarySkeleton from "./SecretarySkeleton";

export default function SecretsSection({
  secretaries,
  isSecretariesLoading,
  isSecretariesError,
  onUpdatePermissions,
}) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">السكرتير</h2>
      </CardHeader>
      <CardContent>
        {isSecretariesLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <SecretarySkeleton key={i} />
            ))}
          </div>
        ) : isSecretariesError ? (
          <div className="text-destructive">
            حدث خطأ أثناء تحميل قائمة السكرتير
          </div>
        ) : secretaries && secretaries.length > 0 ? (
          <div className="space-y-4">
            {secretaries.map((secretary) => (
              <SecretaryItem
                key={secretary.user_id}
                secretary={secretary}
                onUpdatePermissions={onUpdatePermissions}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            لا يوجد سكرتير مسجل في هذه العيادة
          </div>
        )}
      </CardContent>
    </Card>
  );
}
