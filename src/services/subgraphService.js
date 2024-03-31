import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

export const querySubgraph = async (query, options) => {
    try {
        const client = new ApolloClient({
            uri: process.env.REACT_APP_SUBGRAPH_URL,
            cache: new InMemoryCache(),
        });
        
        const { data: result, error: error } = await client.query({
            query: gql(query),
            variables: options,
            fetchPolicy: "cache-first",
        });
    
        if (result && !error) {
            return {success: true, result: result}
        } else {
            return {success: false, error: error}
        }
    } catch (error) {
        console.log(error)
        return {success: false, error: error}
    }
}