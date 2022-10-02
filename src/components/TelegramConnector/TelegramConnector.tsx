import {FC, useContext, useEffect, useState} from 'react';

import cl from "./TelegramConnector.module.css";
import TeleTokenService from "../../API/TeleTokenService";
import {Context} from "../../index";
import {useFetching} from "../../hooks/useFetching";
import LoaderText from "../UI/Loader/LoaderText";

interface TelegramConnectorInterface {
    setModalVisible: (_value: boolean) => void;
}

interface TokenData {
    token: string;
    telegramUser?: string;
    user: string;
}

const TelegramConnector: FC<TelegramConnectorInterface> = ({setModalVisible}) => {

    const [tokenData, setTokenData] = useState<TokenData | null>(null);
    const {store} = useContext(Context);
    const loggedUserId = store.userId;

    const {fetching: fetch, isLoading, error: _error} = useFetching(async () => {
        await TeleTokenService.getTokenData(loggedUserId)
            .then((response) => {
                console.log(response);
                if (response.data.token) {
                    setTokenData(response.data);
                }
            })
            .catch(error => store.addError(error));
    });

    useEffect(() => {
        fetch()
    }, []);

    const generateToken = async () => {
        await TeleTokenService.getToken(loggedUserId)
            .then((response) => {
                console.log(response);
                setTokenData(response.data);
                navigator.clipboard.writeText(response.data.token);
            })
            .catch(error => store.addError(error));
    };

    const updateToken = async () => {
        await TeleTokenService.updateToken(loggedUserId)
            .then((response) => {
                console.log(response);
                setTokenData(response.data.token);
                navigator.clipboard.writeText(response.data.token);
            })
            .catch(error => store.addError(error));
    };


    return (
        <div className={cl.main}>
            <div className={cl.header}>
                <p>
                    Привязка Telegram аккаунта к профилю
                </p>
                <button type="button" onClick={() => setModalVisible(false)}>
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>
            {isLoading ? <LoaderText/> :
                <>
                    <div className={cl.content}>
                        <div className={cl['for_what']}>
                            <div>
                                Зачем?
                            </div>
                            <div>
                                Для получения уведомлений о новых сообщениях/лайках/комментариях и тд., список будет
                                расширяться
                            </div>
                        </div>
                        <div className={cl.how}>
                            <div>
                                Как?
                            </div>
                            <div>
                                <ol>
                                    <li>Сгенерировать уникальный токен, нажав на
                                        кнопку {'"Сгенерировать токен"'} ниже.
                                    </li>
                                    <li>Отправить боту <a href="https://t.me/allconnect_bot" target="_blank"
                                                          rel="noreferrer">allconnect</a> команду /token
                                    </li>
                                    <li>Отправить боту токен</li>
                                    <li>Готово! Аккаунт привязан.</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    <div className={cl.generate}>
                        {tokenData === null ?
                            <button onClick={generateToken}>Сгенерировать токен</button>
                            :
                            <>
                                <div className={cl.status_telegram}>
                                    <p className={tokenData.telegramUser ? cl.ok : cl['not_ok']}>
                                        Telegram {tokenData.telegramUser ? '' : 'не'} привязан
                                    </p>
                                    <a href="#" onClick={fetch}>Обновить</a>
                                </div>
                                <div className={cl['for_token']}>
                                    <div>
                                        Токен:
                                    </div>
                                    <div className={cl.token}>
                                        {tokenData.token}
                                    </div>
                                    <div className={cl.icons}>
                                        <i className="bi bi-clipboard"
                                           onClick={() => navigator.clipboard.writeText(tokenData.token)}></i>
                                    </div>
                                </div>
                                <button onClick={updateToken}>Обновить токен*</button>
                                <div>
                                    * При обновлении токена необходимо заново привязывать аккаунт
                                </div>
                            </>
                        }

                    </div>
                </>
            }
        </div>
    );
};

export default TelegramConnector;