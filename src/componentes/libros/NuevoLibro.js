import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {firestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';

class NuevoLibro extends Component {
    state = {  
        titulo: '',
        codigo: '',
        editorial:'',
        existencia: ''
    }

    
    //extrae valores del input y coloca en el state
    leerDato = (e) =>{
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    
    agregarLibro = (e) =>{
        e.preventDefault();

        //extraer valores del state
        const nuevoLibro = this.state;
        nuevoLibro.prestados = [];
        //extraer firestore de props
        const {firestore, history} = this.props;
        
        //guardar en bd
        firestore.add({
            collection: 'libros'
        }, nuevoLibro)
            .then(()=> history.push('/'))
    }

    render() { 
        return ( 
            <div className="row">
                <div className="col-12 mb-4">
                    <Link to="/" className="btn btn-secondary">
                        <i className="fas fa-arrow-circle-left"></i>{''} Volver al Listado
                    </Link>
                </div>
                <div className="col-12">
                    <h2>
                        <i className="fas fa-book"></i>{''} Nuevo Libro
                    </h2>

                    <div className="row justify-content-center">
                        <div className="col-md-8 mt-5">
                            <form onSubmit={this.agregarLibro}>
                                <div className="form-group">
                                    <label>Titulo:</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        name="titulo"
                                        placeholder="Titulo del Libro"
                                        required
                                        onChange={this.leerDato}
                                        value={this.state.titulo}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Identificador:</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        name="codigo"
                                        placeholder="Identificador del Libro"
                                        required
                                        onChange={this.leerDato}
                                        value={this.state.codigo}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Editorial:</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        name="editorial"
                                        placeholder="Editorial del Libro"
                                        required
                                        onChange={this.leerDato}
                                        value={this.state.editorial}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Existencia:</label>
                                    <input 
                                        type="number"
                                        className="form-control"
                                        name="existencia"
                                        placeholder="Existencia del Libro"
                                        required
                                        onChange={this.leerDato}
                                        value={this.state.existencia}
                                    />
                                </div>

                                <input type="submit" value="Agregar Libro" className="btn btn-success"/>

                            </form>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
 
NuevoLibro.propTypes = {
    firestore : PropTypes.object.isRequired
}

export default firestoreConnect() (NuevoLibro);