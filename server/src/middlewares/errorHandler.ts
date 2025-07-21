// --- src/middlewares/errorHandler.ts ---
import { Request, Response, NextFunction } from 'express';
// export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
//   res.status(500).json({ error: err.message });
// };

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) =>{

    const status = err.statuscode || 500;
    res.json(
        {
            success:false,
            message:err.message || "something went wrong",
            status
        }
    )

}