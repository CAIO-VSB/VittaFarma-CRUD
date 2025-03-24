    import { database } from "@/DB/fireBase";
    import { ref, set } from "firebase/database";
    import { auth } from "@/DB/fireBase"
    import { createUserWithEmailAndPassword } from "firebase/auth";

    export async function CreateUsuário(email, name, telefone, cargo, escala, senha) {
        //Linha responsável por setar no firebase auth. Setando a senha do usuário e email
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha)
        //Aqui eu extraio somente o nome do obejto user criado. Para possíveis manipulações 
        const user = userCredential.user

         //Faço referência direta ao meu DB, e nele eu seto uma sessão chamada user com suas respectivas keys.
        await set(ref(database, `Users/${user.uid}`), {
            Email: email,
            Nome: name,
            Telefone: telefone,
            Cargo: cargo,
            Escala: escala,
            criadoEm: new Date().toDateString(),
        })
    }
