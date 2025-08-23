import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const requireAuth = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];


  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
     req.userWalletAddress = payload.address; // ✅ assign wallet addre
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
