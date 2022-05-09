import axios from 'axios';

/* 
    *Receber code(string)
    *Recuperar o access_token no github
    *Recuperar infos do user do github
    *Verificar se o usuario exsite no Banco de dados, se existir a gente gera um token, se nao cria no banco de dados e gera um token.
    *Retornar o token com as infos do user
*/

interface IAccessTokenResponse {
    access_token: string
}

interface IUserResponse {
    avatar_url: string,
    login: string,
    id: number,
    name: string
}

class AuthenticateUserService {
    async execute(code: string) {
        const url = "https://github.com/login/oauth/access_token"

        const { data: accessTokenReponse} = await axios.post<IAccessTokenResponse>(url, null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            }, 
            headers: {
                "Accept": "application/json"
            }
        })

        const response = await axios.get<IUserResponse>("https://api.github.com/user", {
            headers: {
                authorization: `Bearer ${accessTokenReponse.access_token}`
            }
        })

        // toda info retornada é colocado dentro desse data
        return response.data;
    }
}

export { AuthenticateUserService }