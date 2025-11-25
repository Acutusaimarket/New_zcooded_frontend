import { useGetAuthenticatedUser } from "@/api/query/use-get-user";

const AuthenticateUser = () => {
  // This component is a placeholder for user authentication logic.
  useGetAuthenticatedUser();

  return null; // No UI is rendered, as this component is used for side effects only.
};

export default AuthenticateUser;
