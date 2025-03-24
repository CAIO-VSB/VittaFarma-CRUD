    import { auth } from "@/DB/fireBase"
    import { signInWithEmailAndPassword } from "firebase/auth";
    
    
    export async function signUser(user, password) {

        try {
            const userCredential = await signInWithEmailAndPassword(auth, user, password)

            const loggedUser = userCredential.user
            
            return loggedUser;

        } catch (error) {
            //console.log("Erro ao resolver a promisse")
            return false
        }
    }