import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";

interface SettingsAccountCardProps {
  email: string;
}

export function SettingsAccountCard({
  email,
}: Readonly<SettingsAccountCardProps>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Account</CardTitle>
        <CardDescription>Your account details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <span className="text-xs text-muted-foreground">Email</span>
          <p className="text-sm font-medium">{email || "—"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
