// whatsapp/prisma.js
//
// 🆕 One shared PrismaClient for the WhatsApp module. Every `new PrismaClient()`
// opens its own connection pool, so new files import this instead of
// creating their own.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
