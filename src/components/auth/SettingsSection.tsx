import UserInfo from "./UserInfo";
import UserEdit from "./UserEdit";
import ProfileSettings from "./ProfileSettings";

export default function SettingsSection() {
  return (
    <div>
      <UserInfo />
      <ProfileSettings />
      <UserEdit />
    </div>
  );
}
