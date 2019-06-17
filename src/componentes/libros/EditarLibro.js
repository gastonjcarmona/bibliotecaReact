import React, { Component } from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
import {Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';

class EditarLibro extends Component {
    
    tituloInput = React.createRef();
    editorialInput = React.createRef();
    codigoInput = React.createRef();
    existenciaInput = React.createRef();

    editarLibro = (e) => {
        e.preventDefault();

        const libroActualizado = {
            titulo: this.tituloInput.current.value,
            editorial: this.editorialInput.current.value,
            codigo: this.codigoInput.current.value,
            existencia: this.existenciaInput.current.value,
        }

        const { libro, firestore, history} = this.props;

        firestore.update({
            collection: 'libros',
            doc: libro.id
        }, libroActualizado)
            .then(history.push('/'));

    }

    render() { 

        const { libro} = this.props;
        if(!libro) return <Spinner/>

        return ( 
            <div className="row">
                <div className="col-12 mb-4">
                    <Link to="/" className="btn btn-secondary">
                        <i className="fas fa-arrow-circle-left"></i>{''} Volver al Listado
                    </Link>
                </div>
                <div className="col-12">
                    <h2>
                        <i className="fas fa-book"></i>{''} Edidar Libro
                    </h2>

                    <div className="row justify-content-center">
                        <div className="col-md-8 mt-5">
                            <form onSubmit={this.editarLibro}>
                                <div className="form-group">
                                    <label>Titulo:</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        name="titulo"
                                        placeholder="Titulo del Libro"
                                        required
                                        ref={this.tituloInput}
                                        defaultValue={libro.titulo}
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
                                        ref={this.codigoInput}
                                        defaultValue={libro.codigo}
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
                                        ref={this.editorialInput}
                                        defaultValue={libro.editorial}
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
                                        ref={this.existenciaInput}
                                        defaultValue={libro.existencia}
                                    />
                                </div>

                                <input type="submit" value="Editar Libro" className="btn btn-success"/>

                            </form>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
 


EditarLibro.propTypes = {
    firestore: PropTypes.object.isRequired
}

export default compose(
    firestoreConnect(props=> [{
        collection: 'libros',
        storeAs : 'libro',
        doc: props.match.params.id
    }]),
    connect(({firestore: {ordered}}, props) => ({
        libro: ordered.libro && ordered.libro[0]
    }))
) (EditarLibro);