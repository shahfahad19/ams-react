import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Menu = (props) => {
    return (
        <div>
            <p className='font-medium text-center mb-2'>
                <span className='underline underline-offset-4 md:no-underline md:bg-neutral md:text-neutral-content rounded-box text-md px-3 py-1'>
                    Menu
                </span>
            </p>
            <div className='flex justify-center md:block'>{props.children}</div>
        </div>
    );
};

export const MenuItems = (props) => {
    return (
        <ul className='w-full menu border border-solid md:shadow-none md:border-none menu-horizontal rounded-box menu-compact bg-base-100 md:menu-vertical md:rounded-none'>
            {props.children}
        </ul>
    );
};

export const MenuItem = (props) => {
    const navigate = useNavigate();

    const check = (event) => {
        event.preventDefault();
        navigate(props.tab, { replace: true });
    };
    return (
        <li className='w-1/2 inline-block md:w-auto'>
            <NavLink
                onClick={check}
                to={props.tab}
                className={({ isActive }) => (isActive ? 'bg-neutral text-neutral-content' : undefined)}
            >
                {props.text}
            </NavLink>
        </li>
    );
};

export default Menu;
