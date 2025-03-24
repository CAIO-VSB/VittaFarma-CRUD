    import { auth } from "@/DB/fireBase"
    import { sendPasswordResetEmail } from "firebase/auth";
    import { database } from "@/DB/fireBase";
    import { ref, get, query, orderByChild, equalTo } from "firebase/database";

    export async function RecuperarSenha(email) {

        try {
            //Referncia direta ao meu Db
            const usersRef = ref(database, `/Users`)
            //Consulta personalizada para filtra somente pelo email
            const queryUser = query(usersRef, orderByChild("Email"), equalTo(email))
            //captura do momento atual do meu DB
            const userSnapshot = await get(queryUser)
            //Extração e alocacao desses dados em uma variavel
            
            if (userSnapshot.exists()) {
                const emailUser = await sendPasswordResetEmail(auth, email)
                return emailUser
            }


        } catch (error) {
            console.log(error)
            return false
        }
    }