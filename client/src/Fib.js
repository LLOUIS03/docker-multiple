import React, { Component } from 'react'
import axios from 'axios'

export default class Fib extends Component {
    state = {
        seenIndexes: [],
        values: {},
        index: ''
    };

    async componentDidMount() {
        await this.fetchValues();
    }

    async fetchValues() {
        const [
            { data: dataValues }, 
            { data: dataIndex }
        ] = await Promise.all([
            axios.get('/api/values/current'), 
            axios.get('/api/values/all') 
        ]);

        this.setState({ 
            ...this.state, 
            values: dataValues, 
            seenIndexes: dataIndex
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        await axios.post('/api/values', {
            index: this.state.index
        });

        this.setState({...this.state, index: ''})
    }

    renderSeenIndexes(){
        const { seenIndexes } = this.state;
        return seenIndexes.map(({ number }) => number ).join(', ')
    }

    renderValues() {
        const entries = [];
        const { values } = this.state;
        for(let key in values) {
            entries.push(
            <div key={key}>
                For index {key} i Calculated {values[key]}
            </div>
            );
        }

        return entries;
    }

    onChange = ({ target: { value }}) => {
        this.setState({...this.state, index: value})
    }

    render(){
        console.log('render')
        const { index } = this.state
        return(
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter your index:</label>
                    <input 
                        value={index}
                        onChange={this.onChange}
                    />
                    <button>Submit</button>
                </form>
                <h3>Indexes i have seen:</h3>
                {this.renderSeenIndexes()}
                <h3>Calculated values:</h3>
                {this.renderValues()}
            </div>
        )
    }

}