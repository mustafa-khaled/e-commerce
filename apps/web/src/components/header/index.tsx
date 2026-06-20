import Container from "../container";
import CurrencySwitcher from "./currency-switcher";
import LanguageSwitcher from "./language-switcher";
import Logo from "./Logo";
import NavBar from "./NavBar";

export default function Header() {
  return (
    <header className="header sticky top-0 bg-white shadow-md flex items-center justify-between px-8 py-02">
      <Container className="flex items-center justify-between">
        <Logo />
        <NavBar />
        <div className="flex items-center gap-3">
          <CurrencySwitcher />
          <LanguageSwitcher />
        </div>
      </Container>
    </header>
  );
}
