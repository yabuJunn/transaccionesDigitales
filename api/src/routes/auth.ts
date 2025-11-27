import { Router, Request, Response } from 'express';
import { auth } from '../config/firebase';
import { verifyFirebaseToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

/**
 * POST /auth/setClientRole
 * Asigna el rol "client" a un usuario por email
 * Requiere autenticación de admin
 */
router.post(
  '/setClientRole',
  verifyFirebaseToken, // Requiere autenticación de admin
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { email } = req.body;

      // Validar que se proporcionó el email
      if (!email || typeof email !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Email es requerido',
        });
      }

      // Buscar el usuario por email
      let user;
      try {
        user = await auth.getUserByEmail(email);
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          return res.status(404).json({
            success: false,
            error: 'Usuario no encontrado con ese email',
          });
        }
        throw error;
      }

      // Asignar custom claim "role: client"
      await auth.setCustomUserClaims(user.uid, {
        role: 'client',
      });

      console.log(`✅ Rol "client" asignado a usuario: ${email} (UID: ${user.uid})`);

      return res.json({
        success: true,
        message: `Rol "client" asignado exitosamente a ${email}`,
        data: {
          uid: user.uid,
          email: user.email,
          role: 'client',
        },
      });
    } catch (error: any) {
      console.error('Error al asignar rol de cliente:', error);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

export default router;

