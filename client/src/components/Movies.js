import { Table, Space, Button } from 'antd';
import React from 'react';

export const Movies = (props) => {

    const { commonMovies, allGenreMovieDict } = props;

    const tableColumns = [
        {
            title: "Movie ID",
            dataIndex: "movieId",
            key: "movieId"
        },
        {
            title: "Movie Name",
            dataIndex: "movieName",
            key: "movieName"
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action"
        }
    ]

    const openInNewTab = url => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const dataSource = commonMovies.map((val) => ({
        movieId: allGenreMovieDict[val],
        movieName: val,
        action: (
            <Space>
                <Button type="primary"
                    onClick={() => openInNewTab("https://www.themoviedb.org/movie/" + allGenreMovieDict[val])}
                >Movie</Button>
            </Space>
        )
    }))
    console.log("Datasource: ", dataSource )

    return (
        <Table
            pagination={{
                hideOnSinglePage: true,
                position: "bottomRight",
                pageSize: 5,
                showSizeChanger: false,
                showTotal: (total, range) =>
                `${range[0]} - ${range[1]} of ${total} items`
            }}
            columns={tableColumns}
            dataSource = {dataSource}
            style={{width: "100%", marginTop: "24px"}}
        />
    )
}