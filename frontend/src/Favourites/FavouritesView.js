import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorView } from "../components/errorView";
import { useAuth } from "../components/is_authenticated_component";
import Product from "../Product/product_card";
import { getHeaders } from "../utils";
import { url } from "../constants";

export function FavouritesView() {
    const nav = useNavigate();
    const { isAuthenticated } = useAuth();
    const [favourites, setFavourites] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        const fetchFavourites = async () => {
            const response = await fetch(url + "/favourites/?page=1", {
                method: "GET",
                mode: "cors",
                headers: getHeaders(),
                credentials: "include",
            });

            const json = await response.json();
            if (!response.ok) {
                throw Error(JSON.stringify(json));
            }

            const results = Array.isArray(json.results) ? json.results : Array.isArray(json) ? json : [];
            setFavourites(results.map(item => item.product || item));
        };

        fetchFavourites().catch((error) => {
            console.error(error);
            try {
                const json = JSON.parse(error.message);
                if ("detail" in json) {
                    setError(json["detail"]);
                }
            } catch {
                setError("Unable to load favourites.");
            }
        });
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <ErrorView message="You must be logged in to access this page." />;
    }

    if (error !== null) {
        return <ErrorView message={error} />;
    }

    if (favourites.length === 0) {
        return <div className="text-center mt-3">You don't have a favourite product yet.</div>;
    }

    return (
        <div className="d-flex flex-row flex-wrap justify-content-center">
            {favourites.map((product) => (
                <div
                    key={product.id}
                    className="border border-danger rounded px-2 m-2"
                    onClick={() => nav(`/product/${product.id}`)}
                    style={{ cursor: "pointer" }}
                >
                    <Product values={product} />
                </div>
            ))}
        </div>
    );
}
