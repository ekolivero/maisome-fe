export default function Page({ params: { search } }: { params: { search: string }}) {
    return (
        <p> Questa è la pagina di ricerca per {search} </p>
    )
}