import Navigation from "../../components/Navigation";
import { Slot } from "expo-router";

export default function Layout(children) {
  return (
    <div>
        <Slot />
        <Navigation />
    </div>
  );
}
