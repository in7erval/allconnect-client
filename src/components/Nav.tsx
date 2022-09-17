import {NavLink} from "react-router-dom";
import {FC, useContext} from "react";
import {observer} from "mobx-react-lite";
import {Context} from "../index";

interface NavProperties {
    activeClassName: string;
}

const Nav: FC<NavProperties> = ({activeClassName}) => {

    const {store} = useContext(Context);
    const userId = store.userId;

    return (
        <ul>
            <li>
                <NavLink to={`/user${userId}`} className={({isActive}) => isActive ? activeClassName : ""}>
                    <i className="bi bi-person"></i>
                    <div>Моя страница</div>
                </NavLink>
            </li>
            <li>
                <NavLink to="/posts" className={({isActive}) => isActive ? activeClassName : ""}>
                    <i className="bi bi-newspaper"></i>
                    <div>Новости</div>
                </NavLink>
            </li>
            <li>
                <NavLink to="/messages" className={({isActive}) => isActive ? activeClassName : ""}>
                    <i className="bi bi-chat-text"></i>
                    <div>Сообщения</div>
                    {store.countUnreadMessages > 0 && <p>store.countUnreadMessages</p>}
                </NavLink>
            </li>
            <li>
                <NavLink to="/friends" className={({isActive}) => isActive ? activeClassName : ""}>
                    <i className="bi bi-people"></i>
                    <div>Друзья</div>
                </NavLink>
            </li>
        </ul>
    );
};


export default observer(Nav);