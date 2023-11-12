import jwt from "jsonwebtoken";

function jwtTokens({ email,user_id, role_id }) {
  const user = { email, user_id, role_id};
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "3h",
  });
  return accessToken ;
}

export { jwtTokens };
