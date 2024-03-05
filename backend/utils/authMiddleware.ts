import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

interface DecodedToken {
  _id: string;
  email:string;
  name:string;
  verification:string;

}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "TOKEN NOT FOUND",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as jwt.Secret) as DecodedToken;

    // Attach the decoded user ID to the request body
    if (req.body) {
      req.body._id = decoded._id;
      req.body.email = decoded.email;
      req.body.name = decoded.name;
      req.body.verification = decoded.verification
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "ACCESS_TOKEN IS TAMPERED",
      success: false,
    });
  }
};

export default authMiddleware;
