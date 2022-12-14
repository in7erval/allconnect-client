import React, {useContext, useEffect} from 'react';
import PostList from "../components/Post/PostList";
import PostService from "../API/PostService";
import {useInfiniteQuery} from "@tanstack/react-query";
import {useInView} from "react-intersection-observer";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import LoaderPostList from "../components/UI/Loader/LoaderPostList";
import {AxiosResponse} from "axios";
import IPostResponse from "../models/IPostResponse";

function Posts() {
    const LIMIT_POSTS = 10;
    const {store} = useContext(Context);
    const userId = store.userId;
    const {ref: lastElement, inView} = useInView();

    useEffect(() => {
        document.title = "Новости";
    });

    const fetchPosts = ({pageParam: pageParameter = 1}) => {
        return PostService.getAllForUser(userId, LIMIT_POSTS, pageParameter);
    }

    const {
        isLoading,
        data,
        fetchNextPage,
        hasNextPage,
        refetch
    } = useInfiniteQuery<AxiosResponse<IPostResponse>, any>(['posts'], fetchPosts, {
        getNextPageParam: (lastPage, _pages) => {
            const lastPageNumber = lastPage.config.params.page;
            return LIMIT_POSTS * lastPageNumber < lastPage.data.count ? lastPageNumber + 1 : undefined;
        },
        // refetchInterval: 1000,
        // refetchIntervalInBackground: true,
        // enabled: !!userId
    });

    useEffect(() => {
        refetch();
    }, [userId]);

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView]);

    return (
        <>
            {isLoading || !data ? <LoaderPostList/> :
                data.pages.map((group, index) => (
                    <React.Fragment key={index}>
                        <PostList posts={group.data.body}/>
                    </React.Fragment>
                ))
            }
            <div ref={lastElement} style={{height: 20}}/>
        </>
    );
}

export default observer(Posts);