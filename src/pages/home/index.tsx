import { useState, FormEvent, useEffect } from "react";
import styles from "./home.module.css";
import { BsSearch } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

export interface CoinProps {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  rank: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  explorer: string;
  formatedPrice?: string;
  formatedMarket?: string;
  formatedVolume?: string;
}

interface DataProp {
  data: CoinProps[];
}

export function Home() {
  const [input, setInput] = useState("");
  const [coins, setCoins] = useState<CoinProps[]>([]);
  const [suggestion, setSuggestion] = useState<CoinProps[]>([]);
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  async function getData() {
    fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${offset}`).then(
      (response) =>
        response.json().then((data: DataProp) => {
          const coinData = data.data;

          const price = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          });

          const priceCompact = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact",
          });

          const formatedResult = coinData.map((item) => {
            const formated = {
              ...item,
              formatedPrice: price.format(Number(item.priceUsd)),
              formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
              formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr)),
            };

            return formated;
          });
          // console.log(formatedResult);
          const listCoins = [...coins, ...formatedResult];
          setCoins(listCoins);
        })
    );
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (input === "") return;

    navigate(`./detail/${input.toLowerCase().replace(/\s/g, "")}`);
  };

  const handleGetMore = () => {
    if (offset === 0) {
      setOffset(10);
      return;
    }

    setOffset(offset + 10);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.length > 0) {
      const filteredCoins = coins.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestion(filteredCoins);
    } else {
      setSuggestion([]);
    }
  };

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite o nome da moeda..."
          value={input}
          onChange={handleInputChange}
        />
        <button type="submit">
          <BsSearch size={30} color="#FFF" />
        </button>
      </form>

      {suggestion.length > 0 && (
        <ul>
          {suggestion.map((item) => (
            <li
              key={item.id}
              onClick={() => {
                setInput(item.name);
                setSuggestion([]);
              }}
            >
              ({item.symbol}) {item.name}
            </li>
          ))}
        </ul>
      )}

      <table>
        <thead>
          <tr>
            <th scope="col">Moedas</th>
            <th scope="col">Valor de mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Volumes</th>
            <th scope="col">Mudança 24h</th>
          </tr>
        </thead>

        <tbody id="tbody">
          {coins.length > 0 &&
            coins.map((item) => (
              <tr className={styles.tr} key={item.id}>
                <td className={styles.tdLabel} data-Label="Moeda">
                  <div className={styles.name}>
                    <img
                      className={styles.logo}
                      src={`https://assets.coincap.io/assets/icons/${item.symbol.toLocaleLowerCase()}@2x.png`}
                      alt="Logo Cripto"
                    />
                    <Link to={`/detail/${item.id}`}>
                      <span>{item.name}</span> |{item.symbol}
                    </Link>
                  </div>
                </td>

                <td className={styles.tdLabel} data-Label="Valor mercado">
                  {item.formatedMarket}
                </td>

                <td className={styles.tdLabel} data-Label="Preço">
                  {item.formatedPrice}
                </td>

                <td className={styles.tdLabel} data-Label="Volume">
                  {item.formatedVolume}
                </td>

                <td
                  className={
                    Number(item.changePercent24Hr) > 0
                      ? styles.tdProfit
                      : styles.tdLoss
                  }
                  data-Label="Mudança 24h"
                >
                  <span>{Number(item.changePercent24Hr).toFixed(3)}</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <button className={styles.buttonMore} onClick={handleGetMore}>
        Carregar mais
      </button>
    </main>
  );
}
