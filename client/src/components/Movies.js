import { Table } from 'antd';
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
        }
    ]

    const dataSource = commonMovies.map((val) => ({
        movieId: allGenreMovieDict[val],
        movieName: val
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