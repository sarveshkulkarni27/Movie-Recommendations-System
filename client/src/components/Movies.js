import { Table } from 'antd';
import React from 'react';

export const Movies = (props) => {

    const { commonMovies } = props;

    const tableColumns = [
        {
            title: "Movie Index",
            dataIndex: "movieIndex",
            key: "movieIndex"
        },
        {
            title: "Movie Name",
            dataIndex: "movieName",
            key: "movieName"
        }
    ]

    let counter = 1
    const dataSource = commonMovies.map((val) => ({
        movieIndex: counter++,
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