import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs"
import prismadb from "@/lib/prismadb"

export async function PATCH(req: Request, { params }: { params : { botId: string } }) {
    try {
        const body = await req.json()
        const user = await currentUser()
        const { src, name, description, instructions, seed, categoryId } = body

        if (!params.botId){
            return new NextResponse("Bot ID is required", { status: 400 })
        }

        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized", { status: 401 })
        } 

        if (!src || !name || !description || !instructions || !seed || !categoryId){
            return new NextResponse("Missing required fields", { status: 400 })
        }
        
        const bot = await prismadb.bot.update({
            where: {
                id: params.botId,
                userId: user.id,
            },
            data: {
                categoryId,
                userId: user.id,
                userName: user.firstName,
                src,
                name,
                description,
                instructions,
                seed
            }
        })

        return NextResponse.json(bot)


    } catch (error) {
        console.log("[BOT_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params : { botId: string } }) {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        } 

        const bot = await prismadb.bot.delete({
            where: {
                userId,
                id: params.botId
            }
        })

        return NextResponse.json(bot)


    } catch (error) {
        console.log("[BOT_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}