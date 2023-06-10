import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Modal from './Modal/Modal';
import Button from './utils/Button';
import Loader from './utils/Loader';
import { fetchImages } from './api';

const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');

  useEffect(() => {
    if (!searchQuery) return;

    const fetchImagesData = async () => {
      setIsLoading(true);

      try {
        const newImages = await fetchImages(searchQuery, currentPage);
        setImages(prevImages => [...prevImages, ...newImages]);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchImagesData();
  }, [searchQuery, currentPage]);

  const handleSubmit = query => {
    setSearchQuery(query);
    setImages([]);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handleImageClick = imageUrl => {
    setModalImageUrl(imageUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalImageUrl('');
  };

  return (
    <div>
      <Searchbar onSubmit={handleSubmit} />
      {isLoading && <Loader />}
      <ImageGallery images={images} onImageClick={handleImageClick} />
      {images.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            hasMoreImages={images.length % 12 === 0}
          >
            Load More
          </Button>
        </div>
      )}
      {showModal && (
        <Modal imageUrl={modalImageUrl} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;
