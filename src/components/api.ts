const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbzKNuDGtT3-8HE5h_CHq8IhDtgbc3HqCFIFoSU5nrQYaUG-24od68accu-AVv0FsY-qjw/exec';

export const kirimNilaiSiswa = async (nama: string, kelas: string, skor: number) => {
  const dataSiswa = { nama, kelas, skor };

  try {
    const response = await fetch(URL_APPS_SCRIPT, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', 
      },
      body: JSON.stringify(dataSiswa),
    });

    return await response.json();
  } catch (error) {
    console.error('Terjadi kesalahan jaringan:', error);
    throw error;
  }
};