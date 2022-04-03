const ROLES = {
  STUDENT: "STUDEN",
  ADMIN: "ADMIN",
  MENTOR: "MENTOR",
};

const inRole =
  (...roles) =>
  (req, res, next) => {
    const role = roles.find((role) => req.user.role === role);
    if (!role) {
      return res.status(401).json({ message: "no access" });
    }
    next();
  };

module.exports = {
  inRole,
  ROLES,
};
