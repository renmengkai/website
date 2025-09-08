import { PageProps } from "$fresh/server.ts";
import data from "../api/data.json" with { type: "json" };
import FavoriteButton from "../../islands/FavoriteButton.tsx";
import { LinkButton } from "../../components/LinkButton.tsx";

export default function DinosaurPage(props: PageProps) {
  const name = props.params.dinosaur;
  const dinosaur = data.find((d: { name: string }) =>
    d.name.toLowerCase() === name.toLowerCase()
  );

  if (!dinosaur) {
    return (
      <main>
        <h1>Dinosaur not found</h1>
      </main>
    );
  }

  return (
    <main>
      <h1>{dinosaur.name}</h1>
      <p>{dinosaur.description}</p>
      <FavoriteButton />
      <LinkButton href="/" class="btn-secondary">← Back to list</LinkButton>
    </main>
  );
}
