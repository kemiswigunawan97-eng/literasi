const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbx8UQa-2yNCy4n2ZvZ-1mbq-PHcMrbukG_F3NU30E0bKA825EN3WmNt21TZfFNpkQ7uxg/exec';

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