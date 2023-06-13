import gql from "graphql-tag";

export const SignupMutation = gql`
  mutation SignupMutation($name: String, $email: String!, $pwd: String!) {
    signupUser(name: $name, email: $email, pwd: $pwd) {
      id
    }
  }
`;

export const UserQuery = gql`
  query UserQuery($email: String!, $pwd: String!) {
    login(email: $email, pwd: $pwd) {
      id
    }
  }
`;
