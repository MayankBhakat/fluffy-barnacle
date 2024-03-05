import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: any; // Update this type based on what your user object looks like
}

const verifyIsLoggedIn = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(403).send({
       message: "A TOKEN IS REQUIRED FOR AUTHENTICATION",
       success:false});
    }

    try {

    //We have to define the type secret otherwise it shows "Bhayanak error" and says type is unassignable
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY as Secret);

      //This is authentication request
      req.user = decoded;

      //We use next() in catch blog to make sure the middleware after this middleware will work properly
      next();
    } catch (err) {
      return res.status(401).send({
        message:"UNAUTHORIZED. INVALID TOKEN",
        success:true});
    }
  } catch (err) {
    next(err);
  }
};

export default verifyIsLoggedIn;
