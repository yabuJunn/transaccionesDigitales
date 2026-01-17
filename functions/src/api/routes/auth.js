"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_1 = require("../config/firebase");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * POST /auth/setClientRole
 * Asigna el rol "client" a un usuario por email
 * Requiere autenticación de admin
 */
router.post('/setClientRole', auth_1.verifyFirebaseToken, // Requiere autenticación de admin
async (req, res) => {
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
            user = await firebase_1.auth.getUserByEmail(email);
        }
        catch (error) {
            if (error.code === 'auth/user-not-found') {
                return res.status(404).json({
                    success: false,
                    error: 'Usuario no encontrado con ese email',
                });
            }
            throw error;
        }
        // Asignar custom claim "role: client"
        await firebase_1.auth.setCustomUserClaims(user.uid, {
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
    }
    catch (error) {
        console.error('Error al asignar rol de cliente:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});
/**
 * POST /auth/setBankRole
 * Asigna el rol "bank" a un usuario por email
 * Requiere autenticación de admin
 */
router.post('/setBankRole', auth_1.verifyFirebaseToken, // Requiere autenticación de admin
async (req, res) => {
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
            user = await firebase_1.auth.getUserByEmail(email);
        }
        catch (error) {
            if (error.code === 'auth/user-not-found') {
                return res.status(404).json({
                    success: false,
                    error: 'Usuario no encontrado con ese email',
                });
            }
            throw error;
        }
        // Obtener claims existentes para preservarlos
        const existingClaims = user.customClaims || {};
        // Asignar custom claim "role: bank"
        // También mantener el claim legacy "bank: true" para compatibilidad
        await firebase_1.auth.setCustomUserClaims(user.uid, {
            ...existingClaims,
            role: 'bank',
            bank: true, // Mantener compatibilidad con sistema legacy
        });
        console.log(`✅ Rol "bank" asignado a usuario: ${email} (UID: ${user.uid})`);
        return res.json({
            success: true,
            message: `Rol "bank" asignado exitosamente a ${email}`,
            data: {
                uid: user.uid,
                email: user.email,
                role: 'bank',
            },
        });
    }
    catch (error) {
        console.error('Error al asignar rol de banco:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});
/**
 * POST /auth/createClientAccount
 * Crea una cuenta de cliente en Firebase Auth y asigna el rol "client"
 * Requiere autenticación de admin
 */
router.post('/createClientAccount', auth_1.verifyFirebaseToken, // Requiere autenticación de admin
async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validar que se proporcionaron email y password
        if (!email || typeof email !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Email es requerido',
            });
        }
        if (!password || typeof password !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Password es requerido',
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'La contraseña debe tener al menos 6 caracteres',
            });
        }
        // Crear usuario en Firebase Auth
        let user;
        try {
            user = await firebase_1.auth.createUser({
                email,
                password,
            });
        }
        catch (error) {
            if (error.code === 'auth/email-already-exists') {
                return res.status(400).json({
                    success: false,
                    error: 'El email ya está registrado',
                });
            }
            else if (error.code === 'auth/invalid-email') {
                return res.status(400).json({
                    success: false,
                    error: 'Email inválido',
                });
            }
            else if (error.code === 'auth/weak-password') {
                return res.status(400).json({
                    success: false,
                    error: 'La contraseña es muy débil',
                });
            }
            throw error;
        }
        // Asignar custom claim "role: client"
        await firebase_1.auth.setCustomUserClaims(user.uid, {
            role: 'client',
        });
        console.log(`✅ Cuenta de cliente creada: ${email} (UID: ${user.uid})`);
        return res.json({
            success: true,
            message: `Cuenta de cliente creada exitosamente para ${email}`,
            data: {
                uid: user.uid,
                email: user.email,
                role: 'client',
            },
        });
    }
    catch (error) {
        console.error('Error al crear cuenta de cliente:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});
/**
 * POST /auth/createBankAccount
 * Crea una cuenta de banco/auditor en Firebase Auth y asigna el rol "bank"
 * Requiere autenticación de admin
 */
router.post('/createBankAccount', auth_1.verifyFirebaseToken, // Requiere autenticación de admin
async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validar que se proporcionaron email y password
        if (!email || typeof email !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Email es requerido',
            });
        }
        if (!password || typeof password !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Password es requerido',
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'La contraseña debe tener al menos 6 caracteres',
            });
        }
        // Crear usuario en Firebase Auth
        let user;
        try {
            user = await firebase_1.auth.createUser({
                email,
                password,
            });
        }
        catch (error) {
            if (error.code === 'auth/email-already-exists') {
                return res.status(400).json({
                    success: false,
                    error: 'El email ya está registrado',
                });
            }
            else if (error.code === 'auth/invalid-email') {
                return res.status(400).json({
                    success: false,
                    error: 'Email inválido',
                });
            }
            else if (error.code === 'auth/weak-password') {
                return res.status(400).json({
                    success: false,
                    error: 'La contraseña es muy débil',
                });
            }
            throw error;
        }
        // Asignar custom claims: role: "bank" y bank: true (para compatibilidad)
        await firebase_1.auth.setCustomUserClaims(user.uid, {
            role: 'bank',
            bank: true, // Mantener compatibilidad con sistema legacy
        });
        console.log(`✅ Cuenta de banco creada: ${email} (UID: ${user.uid})`);
        return res.json({
            success: true,
            message: `Cuenta de banco creada exitosamente para ${email}`,
            data: {
                uid: user.uid,
                email: user.email,
                role: 'bank',
            },
        });
    }
    catch (error) {
        console.error('Error al crear cuenta de banco:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map