import React, { Component } from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
import {Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';
import FichaSuscriptor from '../suscriptores/FichaSuscriptor';

//Redux Actions
import {buscarUsuario} from '../../actions/buscarUsuarioActions';

class PrestamoLibro extends Component {

    state = {
        busqueda: '',
        noResultados: false
    }

    //Buscar alumno por codigo
    buscarAlumno = e =>{
        e.preventDefault();

        const {busqueda} = this.state;
        const {firestore, buscarUsuario} = this.props;

        //consulta a la bd
        const coleccion = firestore.collection('suscriptores');
        const consulta = coleccion.where("codigo", "==", busqueda).get();

        consulta.then(resul =>{
            if(resul.empty){
                //no ha resultados

                //almacenar en redux un objeto vacio
                buscarUsuario({});
                this.setState({
                    noResultados: true
                })
            }else{
                //si hay resultados
                const datos = resul.docs[0];

                //almacenar en redux el resultado
                buscarUsuario(datos.data());

                
                this.setState({
                    noResultados: false
                })

            }
        })


    }

    // Almacenar el codigo en state
    leerDato = e =>{
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    solicitarPrestamo = () =>{
        const suscriptor = this.props.usuario;

        suscriptor.fecha_solicitud = new Date().toLocaleDateString();
        
        let prestados = [];
        prestados = [...this.props.libro.prestados, suscriptor];

        const libro = {...this.props.libro};

        //elimino los prestados anteriores
        delete libro.prestados;

        libro.prestados = prestados;

        const {firestore, history} =  this.props;
        firestore.update({
            collection: 'libros',
            doc: libro.id
        }, libro)
            .then(history.push('/'));
    }

    render() { 

        const { libro, usuario} = this.props;
        if(!libro) return <Spinner/>


        let fichaAlumno, btnSolicitar;

        if(usuario.nombre){
            fichaAlumno = <FichaSuscriptor 
                                alumno={usuario}
                            />
            btnSolicitar=<button type="button" className="btn btn-primary btn-block" onClick={this.solicitarPrestamo}>Solicitar Prestamo</button>
        }else{
            fichaAlumno = null;
            btnSolicitar = null;
        }

        //mostrar mensaje de error
        const {noResultados} = this.state;
        let mensajeResultado= '';

        if(noResultados){
            mensajeResultado = <div className="alert alert-danger text-center font-weight-bold">No hay resultados para ese codigo</div>
        }else{
            mensajeResultado = null;
        }


        return (
            <div className="row">
                <div className="col-12 mb-4">
                    <Link to="/" className="btn btn-secondary">
                        <i className="fas fa-arrow-circle-left"></i>{''} Volver al Listado
                    </Link>
                </div>
                <div className="col-12">
                    <h2>
                        <i className="fas fa-book"></i>{''} Solicitar Prestamo: {libro.titulo}
                    </h2>
                    
                    <div className="row justify-content-center mt-5">
                        <div className="col-md-8">
                            <form onSubmit={this.buscarAlumno} className="mb-4" >
                                <legend className="color-primary text-center">
                                    Busca el Suscriptor por Codigo
                                </legend>
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        name="busqueda" 
                                        className="form-control" 
                                        onChange={this.leerDato}
                                    />
                                </div>
                                <input type="submit" className="btn btn-success btn-block" value="Buscar Alumno" />
                            </form>

                            {fichaAlumno}
                            {btnSolicitar}
                            {mensajeResultado}

                        </div>
                    </div>

                </div>
            </div>
        );
    }
}


PrestamoLibro.propTypes = {
    firestore: PropTypes.object.isRequired
}

export default compose(
    firestoreConnect(props=> [{
        collection: 'libros',
        storeAs : 'libro',
        doc: props.match.params.id
    }]),
    connect(({firestore: {ordered}, usuario}, props) => ({
        libro: ordered.libro && ordered.libro[0], 
        usuario: usuario
    }), {buscarUsuario})
) (PrestamoLibro);