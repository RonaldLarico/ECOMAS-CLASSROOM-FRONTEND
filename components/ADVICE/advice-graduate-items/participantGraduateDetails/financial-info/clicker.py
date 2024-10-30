import pyautogui as py
import keyboard

position = (289, 497)

while True:
    if keyboard.read_key() == "ctrl" and keyboard.read_key() == "alt" and keyboard.read_key() == "k":
        for i in range(1000):
            py.click(position)