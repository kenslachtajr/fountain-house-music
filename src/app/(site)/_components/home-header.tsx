import { Header } from '~/components/app-header';
import { ListItem } from './list-item';

export function HomeHeader() {
  return (
    <Header>
      <div className="mb-2">
        <h1 className="text-3xl font-semibold text-white">
          Fountain House Music
        </h1>

        <ListItem image="/images/liked.jpeg" name="Liked Songs" href="liked" />
      </div>
    </Header>
  );
}
